import { Hasher } from '@/data/protocols/criptography/hasher'
import { HashComparer } from '@/data/protocols/criptography'
import bcrypt from 'bcrypt'

export class BcrypterAdapter implements Hasher, HashComparer {
  constructor (
    private readonly salt: number
  ) {}

  async hash (password: string): Promise<string> {
    const hash = await bcrypt.hash(password, this.salt)
    return hash
  }

  async compare (value: string, hash: string): Promise<boolean> {
    const isCompareValid = await bcrypt.compare(value, hash)
    return isCompareValid
  }
}
