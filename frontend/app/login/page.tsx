export default function LoginPage() {
  return (
    <main style={{ padding: "2rem" }}>
      <h1>Welcome back</h1>
      <form>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" />

        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" />
      </form>
    </main>
  );
}
