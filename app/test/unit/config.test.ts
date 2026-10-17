import { loadConfig } from '../../src/config';

describe('loadConfig', () => {
  it('falls back to the local development defaults when the env is empty', () => {
    const env = {};

    const config = loadConfig(env);

    expect(config).toEqual({
      port: 3000,
      databaseUrl: 'postgres://election:election@localhost:5432/election_dev',
      jwtSecret: 'dev-secret',
    });
  });

  it('reads PORT, DATABASE_URL and JWT_SECRET from the env it is given', () => {
    const env = {
      PORT: '8080',
      DATABASE_URL: 'postgres://user:pass@db:5432/election_test',
      JWT_SECRET: 'test-secret',
    };

    const config = loadConfig(env);

    expect(config).toEqual({
      port: 8080,
      databaseUrl: 'postgres://user:pass@db:5432/election_test',
      jwtSecret: 'test-secret',
    });
  });
});
