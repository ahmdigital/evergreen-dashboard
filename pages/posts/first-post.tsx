import Link from "next/link";

export default function FirstPost() {

  const aNumber : number = 33;
  return (
    <>
      <h1>First Post with typescript number {aNumber}</h1>
      <h2>
        <Link href="/">
          <a>back to home</a>
        </Link>
      </h2>
    </>
  );
}
