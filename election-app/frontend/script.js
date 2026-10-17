// Production API URL
const API_BASE_URL = 'https://online-election-project.onrender.com';

// Application State
const app = {
    currentUser: null,
    token: null,
    currentPage: 'login',

    // Initialize app
    init() {
        // Check if user is logged in
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        
        if (savedToken && savedUser) {
            this.token = savedToken;
            this.currentUser = JSON.parse(savedUser);
            this.updateUI();
            this.loadProvinces();
        } else {
            this.loadProvinces();
        }
    },

    // Show alert message
    showAlert(message, type = 'success') {
        const alertContainer = document.getElementById('alertContainer');
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.textContent = message;
        alertContainer.appendChild(alert);

        setTimeout(() => {
            alert.remove();
        }, 5000);
    },

    // Show loading spinner
    showLoading(containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = '<div class="loading"><div class="spinner"></div><p>กำลังโหลด...</p></div>';
        }
    },

    // API call helper
    async apiCall(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (this.token && !options.noAuth) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'เกิดข้อผิดพลาด');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // Update UI based on login status
    updateUI() {
        const userInfo = document.getElementById('userInfo');
        const mainNav = document.getElementById('mainNav');

        if (this.currentUser) {
            // Show user info
            userInfo.classList.remove('hidden');
            document.getElementById('userName').textContent = 
                `${this.currentUser.firstname} ${this.currentUser.lastname}`;
            document.getElementById('userRole').textContent = 
                `(${this.currentUser.currentRole})`;

            // Show switch role button if user has multiple roles
            if (this.currentUser.rolename && this.currentUser.rolename.length > 1) {
                document.getElementById('switchRoleBtn').classList.remove('hidden');
            }

            // Update navigation
            mainNav.innerHTML = `
                <button class="active" onclick="app.showPage('dashboard')">แดชบอร์ด</button>
                <button onclick="app.showPage('profile')">โปรไฟล์</button>
                ${this.currentUser.currentRole === 'ROLE_VOTER' || this.currentUser.currentRole === 'ROLE_ADMIN' ? 
                    '<button onclick="app.showPage(\'vote\')">ลงคะแนน</button>' : ''}
                ${this.currentUser.currentRole === 'ROLE_ADMIN' || this.currentUser.currentRole === 'ROLE_ECT' ? 
                    '<button onclick="app.showPage(\'party\')">พรรคการเมือง</button>' : ''}
                ${this.currentUser.currentRole === 'ROLE_ADMIN' || this.currentUser.currentRole === 'ROLE_ECT' ? 
                    '<button onclick="app.showPage(\'constituency\')">เขตเลือกตั้ง</button>' : ''}
                ${this.currentUser.currentRole === 'ROLE_ADMIN' ? 
                    '<button onclick="app.showPage(\'admin\')">จัดการระบบ</button>' : ''}
            `;

            // Show dashboard
            this.showPage('dashboard');
        } else {
            userInfo.classList.add('hidden');
            mainNav.innerHTML = `
                <button class="active" onclick="app.showPage('login')">เข้าสู่ระบบ</button>
                <button onclick="app.showPage('register')">ลงทะเบียน</button>
            `;
        }
    },

    // Show page
    showPage(pageName) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        // Show selected page
        const page = document.getElementById(pageName);
        if (page) {
            page.classList.add('active');
            this.currentPage = pageName;

            // Update nav buttons
            document.querySelectorAll('.nav button').forEach(btn => {
                btn.classList.remove('active');
            });
            event?.target?.classList.add('active');

            // Load page content
            switch(pageName) {
                case 'dashboard':
                    this.loadDashboard();
                    break;
                case 'vote':
                    this.loadVotePage();
                    break;
                case 'party':
                    this.loadParties();
                    break;
                case 'constituency':
                    this.loadConstituencies();
                    break;
                case 'admin':
                    this.loadAdminPage();
                    break;
                case 'profile':
                    this.loadProfile();
                    break;
            }
        }
    },

    // Login
    async login(event) {
        event.preventDefault();
        
        const nationalId = document.getElementById('loginNationalId').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const data = await this.apiCall('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ nationalId, password }),
                noAuth: true
            });

            this.token = data.token;
            this.currentUser = data.user;

            // Save to localStorage
            localStorage.setItem('token', this.token);
            localStorage.setItem('user', JSON.stringify(this.currentUser));

            this.showAlert('เข้าสู่ระบบสำเร็จ!');
            this.updateUI();
        } catch (error) {
            this.showAlert(error.message, 'error');
        }
    },

    // Register
    async register(event) {
        event.preventDefault();

        const constituencyId = document.getElementById('regConstituencyId').value;
        
        if (!constituencyId) {
            this.showAlert('กรุณาเลือกจังหวัด อำเภอ และตำบล เพื่อให้ระบบระบุเขตเลือกตั้งอัตโนมัติ', 'error');
            return;
        }

        const formData = {
            nationalId: document.getElementById('regNationalId').value,
            firstname: document.getElementById('regFirstname').value,
            lastname: document.getElementById('regLastname').value,
            address: document.getElementById('regAddress').value,
            province: document.getElementById('regProvince').value,
            district: document.getElementById('regDistrict').value,
            subdistrict: document.getElementById('regSubdistrict').value,
            consituencyId: parseInt(constituencyId),
            password: document.getElementById('regPassword').value,
            confirmPassword: document.getElementById('regConfirmPassword').value
        };

        if (formData.password !== formData.confirmPassword) {
            this.showAlert('รหัสผ่านไม่ตรงกัน', 'error');
            return;
        }

        try {
            await this.apiCall('/auth/register', {
                method: 'POST',
                body: JSON.stringify(formData),
                noAuth: true
            });

            this.showAlert('ลงทะเบียนสำเร็จ! กรุณาเข้าสู่ระบบ');
            this.showPage('login');
            event.target.reset();
            // Reset constituency fields
            document.getElementById('regConstituencyId').value = '';
            document.getElementById('regConstituencyNumber').value = '';
        } catch (error) {
            this.showAlert(error.message, 'error');
        }
    },

    // Logout
    logout() {
        if (confirm('คุณต้องการออกจากระบบหรือไม่?')) {
            this.token = null;
            this.currentUser = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            this.updateUI();
            this.showAlert('ออกจากระบบเรียบร้อย');
        }
    },

    // Load provinces
    async loadProvinces() {
        try {
            const data = await this.apiCall('/auth/provinces', { noAuth: true });
            const select = document.getElementById('regProvince');
            if (select) {
                select.innerHTML = '<option value="">เลือกจังหวัด</option>';
                data.data.forEach(province => {
                    const option = document.createElement('option');
                    option.value = province;
                    option.textContent = province;
                    select.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Error loading provinces:', error);
        }
    },

    // Load districts
    async loadDistricts() {
        const province = document.getElementById('regProvince').value;
        const districtSelect = document.getElementById('regDistrict');
        const subdistrictSelect = document.getElementById('regSubdistrict');
        const constituencyInput = document.getElementById('regConstituencyId');
        const constituencyNumberDisplay = document.getElementById('regConstituencyNumber');
        
        if (!province) {
            districtSelect.innerHTML = '<option value="">เลือกอำเภอ</option>';
            subdistrictSelect.innerHTML = '<option value="">เลือกตำบล</option>';
            constituencyInput.value = '';
            if (constituencyNumberDisplay) constituencyNumberDisplay.value = '';
            return;
        }

        // Show loading
        districtSelect.innerHTML = '<option value="">กำลังโหลดอำเภอ...</option>';
        districtSelect.disabled = true;
        subdistrictSelect.innerHTML = '<option value="">เลือกตำบล</option>';
        subdistrictSelect.disabled = true;
        constituencyInput.value = '';
        if (constituencyNumberDisplay) constituencyNumberDisplay.value = '';

        try {
            const data = await this.apiCall(`/auth/districts/${encodeURIComponent(province)}`, { noAuth: true });
            districtSelect.innerHTML = '<option value="">เลือกอำเภอ</option>';
            
            if (data.data && data.data.length > 0) {
                data.data.forEach(item => {
                    const option = document.createElement('option');
                    // Support both string array and object array
                    const districtName = typeof item === 'string' ? item : item.district;
                    option.value = districtName;
                    option.textContent = districtName;
                    districtSelect.appendChild(option);
                });
                districtSelect.disabled = false;
                console.log(`✅ โหลดข้อมูล ${data.data.length} อำเภอในจังหวัด${province}`);
            } else {
                districtSelect.innerHTML = '<option value="">ไม่พบข้อมูลอำเภอ</option>';
                this.showAlert('ไม่พบข้อมูลอำเภอในจังหวัดนี้', 'error');
            }
        } catch (error) {
            districtSelect.innerHTML = '<option value="">เกิดข้อผิดพลาด</option>';
            this.showAlert('ไม่สามารถโหลดข้อมูลอำเภอได้: ' + error.message, 'error');
        }
    },

    // Load subdistricts
    async loadSubdistricts() {
        const province = document.getElementById('regProvince').value;
        const district = document.getElementById('regDistrict').value;
        const subdistrictSelect = document.getElementById('regSubdistrict');
        const constituencyInput = document.getElementById('regConstituencyId');
        const constituencyNumberDisplay = document.getElementById('regConstituencyNumber');
        
        if (!province || !district) {
            subdistrictSelect.innerHTML = '<option value="">เลือกตำบล</option>';
            constituencyInput.value = '';
            if (constituencyNumberDisplay) constituencyNumberDisplay.value = '';
            return;
        }

        // Show loading
        subdistrictSelect.innerHTML = '<option value="">กำลังโหลดตำบล...</option>';
        subdistrictSelect.disabled = true;
        constituencyInput.value = '';
        if (constituencyNumberDisplay) constituencyNumberDisplay.value = '';

        try {
            const data = await this.apiCall(
                `/auth/subdistricts/${encodeURIComponent(district)}?province=${encodeURIComponent(province)}`,
                { noAuth: true }
            );
            subdistrictSelect.innerHTML = '<option value="">เลือกตำบล</option>';
            
            if (data.data && data.data.length > 0) {
                data.data.forEach(item => {
                    const option = document.createElement('option');
                    // Support both string array and object array
                    const subdistrictName = typeof item === 'string' ? item : item.subdistrict;
                    option.value = subdistrictName;
                    option.textContent = subdistrictName;
                    subdistrictSelect.appendChild(option);
                });
                subdistrictSelect.disabled = false;
                console.log(`✅ โหลดข้อมูล ${data.data.length} ตำบลในอำเภอ${district}`);
            } else {
                subdistrictSelect.innerHTML = '<option value="">ไม่พบข้อมูลตำบล</option>';
                this.showAlert('ไม่พบข้อมูลตำบลในอำเภอนี้', 'error');
            }
        } catch (error) {
            subdistrictSelect.innerHTML = '<option value="">เกิดข้อผิดพลาด</option>';
            this.showAlert('ไม่สามารถโหลดข้อมูลตำบลได้: ' + error.message, 'error');
        }
    },

    // Load constituency number
    async loadConstituencyNumber() {
        const province = document.getElementById('regProvince').value;
        const district = document.getElementById('regDistrict').value;
        const subdistrict = document.getElementById('regSubdistrict').value;
        const constituencyInput = document.getElementById('regConstituencyId');
        const constituencyNumberDisplay = document.getElementById('regConstituencyNumber');
        
        if (!province || !district || !subdistrict) {
            constituencyInput.value = '';
            if (constituencyNumberDisplay) constituencyNumberDisplay.value = '';
            return;
        }

        // Show loading
        constituencyInput.value = 'กำลังโหลด...';
        constituencyInput.disabled = true;
        if (constituencyNumberDisplay) {
            constituencyNumberDisplay.value = 'กำลังโหลด...';
            constituencyNumberDisplay.disabled = true;
        }

        try {
            const data = await this.apiCall(
                `/auth/constituencynumbers/${encodeURIComponent(subdistrict)}?province=${encodeURIComponent(province)}&district=${encodeURIComponent(district)}`,
                { noAuth: true }
            );
            
            if (data.data && data.data.id) {
                // Store the ID (hidden) and show the constituency number
                constituencyInput.value = data.data.id;
                constituencyInput.disabled = false;
                
                if (constituencyNumberDisplay) {
                    constituencyNumberDisplay.value = data.data.consituencynumber;
                    constituencyNumberDisplay.disabled = false;
                }
                
                this.showAlert(
                    `เขตเลือกตั้ง: ${province} เขตที่ ${data.data.consituencynumber}`, 
                    'success'
                );
            } else {
                constituencyInput.value = '';
                constituencyInput.disabled = false;
                if (constituencyNumberDisplay) {
                    constituencyNumberDisplay.value = '';
                    constituencyNumberDisplay.disabled = false;
                }
                this.showAlert('ไม่พบข้อมูลเขตเลือกตั้งในพื้นที่นี้', 'error');
            }
        } catch (error) {
            constituencyInput.value = '';
            constituencyInput.disabled = false;
            if (constituencyNumberDisplay) {
                constituencyNumberDisplay.value = '';
                constituencyNumberDisplay.disabled = false;
            }
            this.showAlert('ไม่สามารถโหลดข้อมูลเขตเลือกตั้งได้: ' + error.message, 'error');
        }
    },

    // Load profile
    async loadProfile() {
        try {
            const data = await this.apiCall('/auth/profile');
            const content = document.getElementById('profileContent');
            const user = data.user;

            content.innerHTML = `
                <h3>ข้อมูลส่วนตัว</h3>
                <p><strong>ID:</strong> ${user.id}</p>
                <p><strong>เลขบัตรประชาชน:</strong> ${user.nationalId}</p>
                <p><strong>ชื่อ:</strong> ${user.firstname} ${user.lastname}</p>
                <p><strong>เขตเลือกตั้ง:</strong> ${user.consituencypercent} เขต ${user.consituencynumber}</p>
                <p><strong>บทบาท:</strong> ${user.rolename.join(', ')}</p>
                <p><strong>บทบาทปัจจุบัน:</strong> ${user.currentRole}</p>
            `;
        } catch (error) {
            this.showAlert('ไม่สามารถโหลดข้อมูลโปรไฟล์ได้', 'error');
        }
    },

    // Load dashboard
    async loadDashboard() {
        const content = document.getElementById('dashboardContent');
        content.innerHTML = `
            <div class="card">
                <h3>ยินดีต้อนรับ, ${this.currentUser.firstname}!</h3>
                <p>บทบาทปัจจุบัน: <strong>${this.currentUser.currentRole}</strong></p>
                <p>เขตเลือกตั้ง: <strong>${this.currentUser.consituencypercent} เขต ${this.currentUser.consituencynumber}</strong></p>
            </div>
        `;

        // Load vote history if voter
        if (this.currentUser.currentRole === 'ROLE_VOTER' || this.currentUser.currentRole === 'ROLE_ADMIN') {
            try {
                const voteData = await this.apiCall(`/vote/${this.currentUser.id}`);
                if (voteData.data) {
                    content.innerHTML += `
                        <div class="card">
                            <h3>ประวัติการลงคะแนน</h3>
                            <p><strong>ผู้สมัครที่เลือก:</strong> ${voteData.data.candidate.name}</p>
                            <p><strong>วันที่ลงคะแนน:</strong> ${new Date(voteData.data.createdAt).toLocaleString('th-TH')}</p>
                        </div>
                    `;
                } else {
                    content.innerHTML += `
                        <div class="card">
                            <h3>ประวัติการลงคะแนน</h3>
                            <p>คุณยังไม่ได้ลงคะแนนเลือกตั้ง</p>
                        </div>
                    `;
                }
            } catch (error) {
                console.log('No vote history yet');
            }
        }
    },

    // Load vote page
    async loadVotePage() {
        const statusDiv = document.getElementById('voteStatus');
        const candidatesList = document.getElementById('candidatesList');

        this.showLoading('candidatesList');

        try {
            // Check if user already voted
            const voteData = await this.apiCall(`/vote/${this.currentUser.id}`);
            if (voteData.data) {
                statusDiv.innerHTML = `
                    <div class="alert alert-info">
                        คุณได้ลงคะแนนให้กับ <strong>${voteData.data.candidate.name}</strong> แล้ว<br>
                        วันที่: ${new Date(voteData.data.createdAt).toLocaleString('th-TH')}
                    </div>
                `;
                candidatesList.innerHTML = '';
                return;
            }
        } catch (error) {
            // User hasn't voted yet, continue to show candidates
            statusDiv.innerHTML = `<div class="alert alert-info">กรุณาเลือกผู้สมัครที่คุณต้องการลงคะแนน</div>`;
        }

        // Load parties and their candidates
        try {
            const parties = await this.apiCall('/party', { noAuth: true });
            candidatesList.innerHTML = '';

            if (parties.length === 0) {
                candidatesList.innerHTML = '<p>ไม่มีพรรคการเมืองในระบบ</p>';
                return;
            }

            parties.forEach(party => {
                const card = document.createElement('div');
                card.className = 'party-card';
                card.innerHTML = `
                    ${party.imageurl ? `<img src="${party.imageurl}" alt="${party.name}">` : '<div style="height: 150px; background: #f0f0f0; display: flex; align-items: center; justify-content: center;">ไม่มีรูปภาพ</div>'}
                    <h4>${party.name}</h4>
                    ${party.policy ? `<p style="font-size: 0.9em; color: #666;">${party.policy}</p>` : ''}
                    <button class="btn btn-primary" onclick="app.submitVote(${party.id})">ลงคะแนน</button>
                `;
                candidatesList.appendChild(card);
            });
        } catch (error) {
            this.showAlert('ไม่สามารถโหลดข้อมูลผู้สมัครได้', 'error');
            candidatesList.innerHTML = '<p>เกิดข้อผิดพลาดในการโหลดข้อมูล</p>';
        }
    },

    // Submit vote
    async submitVote(candidateId) {
        if (!confirm('คุณต้องการลงคะแนนให้ผู้สมัครท่านนี้หรือไม่?')) {
            return;
        }

        try {
            const voteData = {
                userId: this.currentUser.id,
                consituencyId: this.currentUser.consituencynumber, // Note: Using consituencynumber as ID
                candidateId: candidateId
            };

            await this.apiCall('/vote', {
                method: 'POST',
                body: JSON.stringify(voteData)
            });

            this.showAlert('ลงคะแนนเลือกตั้งสำเร็จ!');
            this.loadVotePage();
        } catch (error) {
            this.showAlert(error.message, 'error');
        }
    },

    // Switch role
    async switchRole() {
        const roles = this.currentUser.rolename;
        const currentRole = this.currentUser.currentRole;

        // Show role selection
        const newRole = prompt(`เลือกบทบาทใหม่:\n${roles.map((r, i) => `${i + 1}. ${r}`).join('\n')}\n\nพิมพ์ชื่อบทบาทที่ต้องการ:`);

        if (!newRole || !roles.includes(newRole)) {
            this.showAlert('บทบาทไม่ถูกต้อง', 'error');
            return;
        }

        try {
            const data = await this.apiCall('/auth/switch-role', {
                method: 'POST',
                body: JSON.stringify({ newRole })
            });

            this.token = data.token;
            this.currentUser.currentRole = newRole;

            // Update localStorage
            localStorage.setItem('token', this.token);
            localStorage.setItem('user', JSON.stringify(this.currentUser));

            this.showAlert(data.message);
            this.updateUI();
        } catch (error) {
            this.showAlert(error.message, 'error');
        }
    },

    // Load parties
    async loadParties() {
        this.showLoading('partyList');

        try {
            const parties = await this.apiCall('/party', { noAuth: true });
            const partyList = document.getElementById('partyList');
            partyList.innerHTML = '';

            if (parties.length === 0) {
                partyList.innerHTML = '<p>ไม่มีพรรคการเมืองในระบบ</p>';
                return;
            }

            parties.forEach(party => {
                const card = document.createElement('div');
                card.className = 'party-card';
                card.innerHTML = `
                    ${party.imageurl ? `<img src="${party.imageurl}" alt="${party.name}">` : '<div style="height: 150px; background: #f0f0f0; display: flex; align-items: center; justify-content: center;">ไม่มีรูปภาพ</div>'}
                    <h4>${party.name}</h4>
                    ${party.policy ? `<p style="font-size: 0.9em; color: #666; margin-bottom: 10px;">${party.policy}</p>` : ''}
                    <div>
                        <button class="btn btn-warning" onclick="app.editParty(${party.id})">แก้ไข</button>
                        <button class="btn btn-danger" onclick="app.deleteParty(${party.id})">ลบ</button>
                    </div>
                `;
                partyList.appendChild(card);
            });
        } catch (error) {
            this.showAlert('ไม่สามารถโหลดข้อมูลพรรคการเมืองได้', 'error');
        }
    },

    // Show party modal
    showPartyModal(partyId = null) {
        const modal = document.getElementById('partyModal');
        const title = document.getElementById('partyModalTitle');

        if (partyId) {
            title.textContent = 'แก้ไขพรรคการเมือง';
            // Load party data
            this.apiCall(`/party/${partyId}`, { noAuth: true })
                .then(party => {
                    document.getElementById('partyId').value = party.id;
                    document.getElementById('partyName').value = party.name;
                    document.getElementById('partyImageUrl').value = party.imageurl || '';
                    document.getElementById('partyPolicy').value = party.policy || '';
                });
        } else {
            title.textContent = 'เพิ่มพรรคการเมือง';
            document.getElementById('partyId').value = '';
            document.getElementById('partyName').value = '';
            document.getElementById('partyImageUrl').value = '';
            document.getElementById('partyPolicy').value = '';
        }

        modal.classList.add('active');
    },

    // Edit party
    async editParty(partyId) {
        this.showPartyModal(partyId);
    },

    // Save party
    async saveParty(event) {
        event.preventDefault();

        const partyId = document.getElementById('partyId').value;
        const partyData = {
            name: document.getElementById('partyName').value,
            imageurl: document.getElementById('partyImageUrl').value || null,
            policy: document.getElementById('partyPolicy').value || null
        };

        try {
            if (partyId) {
                // Update
                await this.apiCall(`/party/${partyId}`, {
                    method: 'PUT',
                    body: JSON.stringify(partyData)
                });
                this.showAlert('แก้ไขพรรคการเมืองสำเร็จ');
            } else {
                // Create
                await this.apiCall('/party', {
                    method: 'POST',
                    body: JSON.stringify(partyData)
                });
                this.showAlert('เพิ่มพรรคการเมืองสำเร็จ');
            }

            this.closeModal('partyModal');
            this.loadParties();
        } catch (error) {
            this.showAlert(error.message, 'error');
        }
    },

    // Delete party
    async deleteParty(partyId) {
        if (!confirm('คุณต้องการลบพรรคการเมืองนี้หรือไม่?')) {
            return;
        }

        try {
            await this.apiCall(`/party/${partyId}`, {
                method: 'DELETE'
            });
            this.showAlert('ลบพรรคการเมืองสำเร็จ');
            this.loadParties();
        } catch (error) {
            this.showAlert(error.message, 'error');
        }
    },

    // Load constituencies
    async loadConstituencies() {
        this.showLoading('constituencyList');

        try {
            const data = await this.apiCall('/constituency/all', { noAuth: true });
            const constituencyList = document.getElementById('constituencyList');
            
            if (data.data.length === 0) {
                constituencyList.innerHTML = '<p>ไม่มีเขตเลือกตั้งในระบบ</p>';
                return;
            }

            let tableHTML = `
                <table>
                    <thead>
                        <tr>
                            <th>หมายเลขเขต</th>
                            <th>จังหวัด</th>
                            <th>อำเภอ</th>
                            <th>ตำบล</th>
                            <th>รหัสไปรษณีย์</th>
                            <th>สถานะ</th>
                            <th>การจัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            data.data.forEach(cons => {
                const status = cons.isclosed ? 
                    '<span class="status-badge status-closed">ปิด</span>' : 
                    '<span class="status-badge status-open">เปิด</span>';

                tableHTML += `
                    <tr>
                        <td>${cons.consituencynumber}</td>
                        <td>${cons.province}</td>
                        <td>${cons.district}</td>
                        <td>${cons.subdistrict}</td>
                        <td>${cons.zipcode}</td>
                        <td>${status}</td>
                        <td>
                            ${cons.isclosed ? 
                                `<button class="btn btn-success" onclick="app.openElection(${cons.id})">เปิด</button>` : 
                                `<button class="btn btn-warning" onclick="app.closeElection(${cons.id})">ปิด</button>`
                            }
                            <button class="btn btn-danger" onclick="app.deleteConstituency(${cons.id})">ลบ</button>
                        </td>
                    </tr>
                `;
            });

            tableHTML += '</tbody></table>';
            constituencyList.innerHTML = tableHTML;
        } catch (error) {
            this.showAlert('ไม่สามารถโหลดข้อมูลเขตเลือกตั้งได้', 'error');
        }
    },

    // Show constituency modal
    showConstituencyModal() {
        const modal = document.getElementById('constituencyModal');
        document.getElementById('consNumber').value = '';
        document.getElementById('consProvince').value = '';
        document.getElementById('consDistrict').value = '';
        document.getElementById('consSubdistrict').value = '';
        document.getElementById('consAddress').value = '';
        document.getElementById('consZipcode').value = '';
        modal.classList.add('active');
    },

    // Save constituency
    async saveConstituency(event) {
        event.preventDefault();

        const consData = {
            consituencynumber: parseInt(document.getElementById('consNumber').value),
            province: document.getElementById('consProvince').value,
            district: document.getElementById('consDistrict').value,
            subdistrict: document.getElementById('consSubdistrict').value,
            address: document.getElementById('consAddress').value,
            zipcode: document.getElementById('consZipcode').value
        };

        try {
            await this.apiCall('/constituency/create', {
                method: 'POST',
                body: JSON.stringify(consData)
            });
            this.showAlert('เพิ่มเขตเลือกตั้งสำเร็จ');
            this.closeModal('constituencyModal');
            this.loadConstituencies();
        } catch (error) {
            this.showAlert(error.message, 'error');
        }
    },

    // Delete constituency
    async deleteConstituency(consId) {
        if (!confirm('คุณต้องการลบเขตเลือกตั้งนี้หรือไม่?')) {
            return;
        }

        try {
            await this.apiCall(`/constituency/${consId}`, {
                method: 'DELETE'
            });
            this.showAlert('ลบเขตเลือกตั้งสำเร็จ');
            this.loadConstituencies();
        } catch (error) {
            this.showAlert(error.message, 'error');
        }
    },

    // Open election
    async openElection(consId) {
        try {
            await this.apiCall(`/constituency/open/${consId}`, {
                method: 'PUT'
            });
            this.showAlert('เปิดการเลือกตั้งสำเร็จ');
            this.loadConstituencies();
        } catch (error) {
            this.showAlert(error.message, 'error');
        }
    },

    // Close election
    async closeElection(consId) {
        try {
            await this.apiCall(`/constituency/close/${consId}`, {
                method: 'PUT'
            });
            this.showAlert('ปิดการเลือกตั้งสำเร็จ');
            this.loadConstituencies();
        } catch (error) {
            this.showAlert(error.message, 'error');
        }
    },

    // Open all elections
    async openAllElections() {
        if (!confirm('คุณต้องการเปิดการเลือกตั้งทุกเขตหรือไม่?')) {
            return;
        }

        try {
            await this.apiCall('/constituency/open/all', {
                method: 'PUT'
            });
            this.showAlert('เปิดการเลือกตั้งทุกเขตสำเร็จ');
            this.loadConstituencies();
        } catch (error) {
            this.showAlert(error.message, 'error');
        }
    },

    // Close all elections
    async closeAllElections() {
        if (!confirm('คุณต้องการปิดการเลือกตั้งทุกเขตหรือไม่?')) {
            return;
        }

        try {
            await this.apiCall('/constituency/close/all', {
                method: 'PUT'
            });
            this.showAlert('ปิดการเลือกตั้งทุกเขตสำเร็จ');
            this.loadConstituencies();
        } catch (error) {
            this.showAlert(error.message, 'error');
        }
    },

    // Load admin page
    async loadAdminPage() {
        this.showLoading('usersList');

        try {
            const data = await this.apiCall('/auth/users');
            const usersList = document.getElementById('usersList');
            const userSelect = document.getElementById('adminUserSelect');
            
            if (data.data.length === 0) {
                usersList.innerHTML = '<p>ไม่มีผู้ใช้ในระบบ</p>';
                return;
            }

            // Populate user select dropdown
            userSelect.innerHTML = '<option value="">-- เลือกผู้ใช้ --</option>';
            data.data.forEach(user => {
                const option = document.createElement('option');
                option.value = JSON.stringify(user); // Store full user data
                option.textContent = `${user.firstname} ${user.lastname} (${user.nationalId})`;
                userSelect.appendChild(option);
            });

            // Display users table
            let tableHTML = `
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>ชื่อ-นามสกุล</th>
                            <th>เลขบัตรประชาชน</th>
                            <th>บทบาท</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            data.data.forEach(user => {
                const roles = user.role.map(r => r.roleName).join(', ');
                tableHTML += `
                    <tr>
                        <td>${user.id}</td>
                        <td>${user.firstname} ${user.lastname}</td>
                        <td>${user.nationalId}</td>
                        <td><span style="background: #e9ecef; padding: 5px 10px; border-radius: 5px; font-size: 0.9em;">${roles}</span></td>
                    </tr>
                `;
            });

            tableHTML += '</tbody></table>';
            usersList.innerHTML = tableHTML;
        } catch (error) {
            this.showAlert('ไม่สามารถโหลดข้อมูลผู้ใช้ได้', 'error');
        }
    },

    // Select user from dropdown
    selectUser() {
        const userSelect = document.getElementById('adminUserSelect');
        const selectedValue = userSelect.value;
        const userInfo = document.getElementById('selectedUserInfo');

        if (!selectedValue) {
            userInfo.classList.add('hidden');
            return;
        }

        try {
            const user = JSON.parse(selectedValue);
            document.getElementById('selectedUserName').textContent = `${user.firstname} ${user.lastname}`;
            document.getElementById('selectedUserNationalId').textContent = user.nationalId;
            document.getElementById('selectedUserRoles').textContent = user.role.map(r => r.roleName).join(', ');
            userInfo.classList.remove('hidden');
        } catch (error) {
            console.error('Error parsing user data:', error);
        }
    },

    // Add role (Admin)
    async addRole() {
        const userSelect = document.getElementById('adminUserSelect');
        const selectedValue = userSelect.value;
        const roleName = document.getElementById('adminRoleName').value;

        if (!selectedValue) {
            this.showAlert('กรุณาเลือกผู้ใช้', 'error');
            return;
        }

        try {
            const user = JSON.parse(selectedValue);
            
            // Check if user already has this role
            if (user.role.some(r => r.roleName === roleName)) {
                this.showAlert(`ผู้ใช้มีบทบาท ${roleName} อยู่แล้ว`, 'error');
                return;
            }

            await this.apiCall('/auth/add-role', {
                method: 'POST',
                body: JSON.stringify({ userid: user.id, roleName })
            });
            this.showAlert('เพิ่มบทบาทสำเร็จ');
            
            // Reload admin page
            this.loadAdminPage();
        } catch (error) {
            this.showAlert(error.message, 'error');
        }
    },

    // Delete role (Admin)
    async deleteRole() {
        const userSelect = document.getElementById('adminUserSelect');
        const selectedValue = userSelect.value;
        const roleName = document.getElementById('adminRoleName').value;

        if (!selectedValue) {
            this.showAlert('กรุณาเลือกผู้ใช้', 'error');
            return;
        }

        try {
            const user = JSON.parse(selectedValue);
            
            // Check if user has this role
            if (!user.role.some(r => r.roleName === roleName)) {
                this.showAlert(`ผู้ใช้ไม่มีบทบาท ${roleName}`, 'error');
                return;
            }

            // Prevent deleting last role
            if (user.role.length === 1) {
                this.showAlert('ไม่สามารถลบบทบาทสุดท้ายได้', 'error');
                return;
            }

            if (!confirm(`คุณต้องการลบบทบาท ${roleName} ของ ${user.firstname} ${user.lastname} หรือไม่?`)) {
                return;
            }

            await this.apiCall('/auth/delete-role', {
                method: 'DELETE',
                body: JSON.stringify({ userid: user.id, roleName })
            });
            this.showAlert('ลบบทบาทสำเร็จ');
            
            // Reload admin page
            this.loadAdminPage();
        } catch (error) {
            this.showAlert(error.message, 'error');
        }
    },

    // Close modal
    closeModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});

// Close modal when clicking outside
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
    }
});