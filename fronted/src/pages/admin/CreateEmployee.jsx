const CreateEmployee = () => {
  return (
    <div className="bg-white p-8 rounded-xl shadow max-w-xl">
      <h2 className="text-2xl font-bold mb-6">Create Employee</h2>

      <form className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          className="w-full border px-4 py-2 rounded-lg"
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full border px-4 py-2 rounded-lg"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border px-4 py-2 rounded-lg"
        />

        <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
          Create
        </button>
      </form>
    </div>
  );
};

export default CreateEmployee;
