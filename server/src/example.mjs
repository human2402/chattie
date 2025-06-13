import sql from 'mssql';
const config = {
  user: 'ms_user',
  password: 'ms_password',
  server: 'sql.institute.local',
  database: 'InstitutionAD',
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};

async function authenticate(username, password) {
  await sql.connect(config);
  const result = await sql.query`
    SELECT id, firstName, lastName 
    FROM Users 
    WHERE login = ${username} AND pwdHash = HASHBYTES('SHA2_256', ${password})`;
  return result.recordset.length > 0
    ? result.recordset[0]
    : null;
}
