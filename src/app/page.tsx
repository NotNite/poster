export default function Home() {
  return (
    <main>
      <h1>poster</h1>
      <p>i think i hauve Covid</p>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <a href="/signup">signup</a>
        <a href="/signin">signin</a>
        <a href="/posts">posts</a>
      </div>
    </main>
  );
}
