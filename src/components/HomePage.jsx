function HomePage() {
  return (
    <div className="container mx-auto p-4 flex flex-col items-center">
      <h1 className="finely-logo text-6xl font-bold mb-8 text-gray-900 dark:text-gray-100">
        Finely
      </h1>

      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Welcome to Finely</h2>
        <p className="text-gray-700 dark:text-gray-300">
          This is the home page of your Finely app.
        </p>
      </div>
    </div>
  );
}

export default HomePage;
