import { turso } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export default async function Home() {
  // 1. Turso에서 데이터 가져오기
  const result = await turso.execute('SELECT * FROM users');
  const users = result.rows;

  // 2. 새로운 사용자를 추가하는 서버 액션(Server Action)
  async function addUser(formData: FormData) {
    'use server';
    const name = formData.get('name');

    await turso.execute({
      sql: 'INSERT INTO users (name) VALUES (?)',
      args: [name as string]
    });

    revalidatePath('/'); // 새로운 데이터를 화면에 보여주기 위해 새로고침
  }

  return (
    <main className="p-10 font-sans">
      <h1 className="text-2xl font-bold mb-4">Turso + Vercel 스터디 앱</h1>

      <form action={addUser} className="mb-6 flex gap-2">
        <input 
          type="text" 
          name="name" 
          placeholder="이름을 입력하세요..." 
          required 
          className="border p-2 rounded text-black"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          추가하기
        </button>
      </form>

      <ul className="list-disc pl-5">
        {users.map((user, index) => (
          <li key={index}>{user.name as string}</li>
        ))}
      </ul>
    </main>
  );
}
