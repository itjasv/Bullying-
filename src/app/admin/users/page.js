"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import styles from "../dashboard.module.css";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  async function fetchUsers() {
    setLoading(true);
    const supabase = createClient();
    let query = supabase
      .from("users")
      .select("id, email, display_name, role, created_at, last_active_at, is_blocked")
      .order("created_at", { ascending: false })
      .limit(100);

    if (filter) query = query.eq("role", filter);

    const { data } = await query;
    setUsers(data || []);
    setLoading(false);
  }

  useEffect(() => { fetchUsers(); }, [filter]);

  const toggleBlock = async (userId, currentlyBlocked) => {
    const supabase = createClient();
    await supabase.from("users").update({ is_blocked: !currentlyBlocked }).eq("id", userId);
    fetchUsers();
  };

  const changeRole = async (userId, newRole) => {
    const supabase = createClient();
    await supabase.from("users").update({ role: newRole }).eq("id", userId);

    // Log the action
    const user = (await supabase.auth.getUser()).data.user;
    await supabase.from("admin_logs").insert({
      admin_id: user.id,
      action: "role_change",
      target_type: "user",
      target_id: userId,
      details: { new_role: newRole },
    });

    fetchUsers();
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.heading}>Users</h1>
        <p className={styles.subtitle}>Manage registered users and roles.</p>
      </div>

      <div style={{ display: "flex", gap: "var(--space-3)", marginBottom: "var(--space-6)" }}>
        <select className="input" value={filter} onChange={(e) => setFilter(e.target.value)} style={{ maxWidth: 200 }}>
          <option value="">All Roles</option>
          <option value="user">Users</option>
          <option value="admin">Admins</option>
          <option value="super_admin">Super Admins</option>
        </select>
      </div>

      {loading ? (
        <p className={styles.loadingText}>Loading users...</p>
      ) : users.length === 0 ? (
        <div className={styles.emptyState}><p className={styles.emptyText}>No users found.</p></div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Email</th>
                <th>Name</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td><code className={styles.mono}>{u.email}</code></td>
                  <td>{u.display_name || "-"}</td>
                  <td>
                    <select className="input" value={u.role} onChange={(e) => changeRole(u.id, e.target.value)} style={{ width: 130, padding: "2px 6px", fontSize: 12 }}>
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                  </td>
                  <td>{u.is_blocked ? <span style={{ color: "var(--danger)" }}>Blocked</span> : <span style={{ color: "#34d399" }}>Active</span>}</td>
                  <td className={styles.dateCell}>{new Date(u.created_at).toLocaleDateString()}</td>
                  <td>
                    <button className="btn btn-ghost btn-sm" onClick={() => toggleBlock(u.id, u.is_blocked)} style={{ fontSize: 11 }}>
                      {u.is_blocked ? "Unblock" : "Block"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
