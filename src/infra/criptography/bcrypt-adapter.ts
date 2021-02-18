import { Encrypter } from '../../data/protocols/encrypter'
import bcrypt from 'bcrypt'

export class BcrypterAdapter implements Encrypter {
  async encrypt (password: string): Promise<string> {
    return ''
  }
}
