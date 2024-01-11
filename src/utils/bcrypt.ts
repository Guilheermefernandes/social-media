import bcrypt from 'bcrypt';

type SchemaPasswordCheck = { currentpassword: string, password: string };
export const validation = async (pass: SchemaPasswordCheck) => {
    return await bcrypt.compare(pass.currentpassword, pass.password);
}

export const createBcrypt = async (password: string) => {
    return await bcrypt.hash(password, 10);
}