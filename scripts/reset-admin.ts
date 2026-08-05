import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const password = '123456789EmIna'
  const email = 'emir@autokozmetika.ba'

  console.log('🔍 Tražim korisnika:', email)

  // Pronađi korisnika
  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    console.log('❌ Korisnik ne postoji! Kreiram novog...')
    const hash = await bcrypt.hash(password, 10)
    const newUser = await prisma.user.create({
      data: {
        email,
        name: 'Emir',
        passwordHash: hash,
        role: 'ADMIN',
        customerType: 'B2C',
        isApproved: true,
      },
    })
    console.log('✅ Korisnik kreiran:', newUser.email)
    return
  }

  console.log('✅ Korisnik pronađen:', user.email)
  console.log('   ID:', user.id)
  console.log('   Role:', user.role)
  console.log('   Has passwordHash:', !!user.passwordHash)

  // Testiraj trenutnu lozinku
  if (user.passwordHash) {
    const isValid = await bcrypt.compare(password, user.passwordHash)
    console.log('   Trenutna lozinka ispravna:', isValid)
  }

  // Generiši novi hash i ažuriraj
  console.log('\n🔄 Resetujem lozinku...')
  const newHash = await bcrypt.hash(password, 10)

  // Verifikuj da novi hash radi
  const testValid = await bcrypt.compare(password, newHash)
  console.log('   Test novog hash-a:', testValid)

  // Ažuriraj u bazi
  await prisma.user.update({
    where: { email },
    data: {
      passwordHash: newHash,
      role: 'ADMIN',
      isApproved: true,
    },
  })

  console.log('✅ Lozinka resetovana!')
  console.log('\n📧 Email:', email)
  console.log('🔑 Lozinka:', password)
}

main()
  .catch((e) => {
    console.error('❌ Greška:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
