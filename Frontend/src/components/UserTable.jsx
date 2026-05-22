function UserTable({
  users,
  deleteUser,
}) {

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">

      <table className="w-full">

        <thead className="bg-black text-white">

          <tr>

            <th className="p-4">
              User ID
            </th>

            <th className="p-4">
              Name
            </th>

            <th className="p-4">
              Email
            </th>

            <th className="p-4">
              Role
            </th>

            <th className="p-4">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {
            users.map((user) => (

              <tr
                key={user._id}
                className="border-b"
              >

                <td className="p-4 text-center">
                  {user.userId}
                </td>

                <td className="p-4 text-center">
                  {user.username}
                </td>

                <td className="p-4 text-center">
                  {user.email}
                </td>

                <td className="p-4 text-center">
                  {user.role}
                </td>

                <td className="p-4 text-center">

                  <button
                    onClick={() =>
                      deleteUser(user._id)
                    }
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>

                </td>

              </tr>
            ))
          }

        </tbody>

      </table>

    </div>
  );
}

export default UserTable;