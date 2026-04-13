export default function UserRolesPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-black text-gray-900">User Roles</h1>
      <p className="text-gray-600 mt-2">Manage user roles and permissions</p>
      <div className="mt-8 bg-white rounded-2xl border border-gray-100 p-6">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left font-bold text-gray-700">Role Name</th>
              <th className="px-4 py-3 text-left font-bold text-gray-700">Users Count</th>
              <th className="px-4 py-3 text-left font-bold text-gray-700">Permissions</th>
              <th className="px-4 py-3 text-left font-bold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[
              { name: "Admin", count: 5, perms: "All permissions" },
              { name: "Agent", count: 234, perms: "Create/Edit properties" },
              { name: "Developer", count: 89, perms: "Create/Edit projects" },
              { name: "Agency", count: 45, perms: "Manage team & properties" },
            ].map(role => (
              <tr key={role.name} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-bold text-gray-900">{role.name}</td>
                <td className="px-4 py-3 text-gray-600">{role.count}</td>
                <td className="px-4 py-3 text-gray-600">{role.perms}</td>
                <td className="px-4 py-3">
                  <button className="text-blue-600 font-bold text-sm hover:underline">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}