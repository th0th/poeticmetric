export default function Fonts() {
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet" />

      <style
        dangerouslySetInnerHTML={{
          __html: `* { font-family: "Inter", "Arial", sans-serif; }`,
        }}
      />
    </>
  );
}
