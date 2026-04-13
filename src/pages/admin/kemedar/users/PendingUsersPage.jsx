import KemedarUsersListTemplate from "@/components/admin/kemedar/users/KemedarUsersListTemplate";

export default function PendingUsersPage() {
  return <KemedarUsersListTemplate title="Pending Approval Users" userType="pending" />;
}