import Header from "~/components/Header";
import Title from "~/components/Title";

export default function Error() {
  return (
    <>
      <Title>An error has occurred</Title>

      <Header />

      <div className="container">An error had occurred.</div>
    </>
  );
}
