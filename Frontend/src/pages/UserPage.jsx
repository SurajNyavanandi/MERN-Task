import { useEffect, useState } from 'react';

import API from '../api/axios';

import MainLayout from '../layouts/MainLayout';

import UserForm from '../components/UserForm';
import UserTable from '../components/UserTable';

function UserPage() {

  const [users, setUsers] = useState([]);

  const [roleFilter, setRoleFilter]
    = useState('');

  const fetchUsers = async () => {

    try {

      const { data } = await API.get(
        `/users?role=${roleFilter}`
      );

      setUsers(data.users);

    } catch (error) {

      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const deleteUser = async (id) => {

    try {

      await API.delete(
        `/users/${id}`
      );

      fetchUsers();

    } catch (error) {

      console.log(error);
    }
  };

  return (
    <MainLayout>


      <div className="bg-white p-5 rounded-xl shadow mb-6">

        <select
          className="border p-3 rounded"
          onChange={(e) =>
            setRoleFilter(e.target.value)
          }
        >

          <option value="">
            All Roles
          </option>

          <option value="ADMIN">
            ADMIN
          </option>

          <option value="UNIT_MANAGER">
            UNIT_MANAGER
          </option>

          <option value="USER">
            USER
          </option>

        </select>

      </div>

  <UserTable users={users} deleteUser={deleteUser} fetchUsers={fetchUsers} />

    </MainLayout>
  );
}

export default UserPage;