"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import styles from "../dashboard.module.css";

export default function AdminSettings() {
  const [user, setUser] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (authUser) {
        const { data: userData } = await supabase
          .from("users")
          .select("*")
          .eq("id", authUser.id)
          .single();
        setUser(userData);
      }

      const { data: adminList } = await supabase
        .from("users")
        .select("id, email, display_name, role, last_active_at, created_at")
        .in("role", ["admin", "super_admin"])
        .order("role", { ascending: false });
      
      setAdmins(adminList || []);
      setLoading(false);
    }
    load();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.heading}>Settings</h1>
        <p className={styles.subtitle}>Account and admin team management.</p>
      </div>

      {loading ? (
        <p className={styles.loadingText}>Loading...</p>
      ) : (
        <>
          {/* Current User */}
          {user && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Your Account</h2>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <tbody>
                    <tr><td style={{ fontWeight: 500 }}>Email</td><td>{user.email}</td></tr>
                    <tr><td style={{ fontWeight: 500 }}>Display Name</td><td>{user.display_name || "Not set"}</td></tr>
                    <tr><td style={{ fontWeight: 500 }}>Role</td><td style={{ textTransform: "capitalize" }}>{user.role?.replace("_", " ")}</td></tr>
                    <tr><td style={{ fontWeight: 500 }}>Joined</td><td>{new Date(user.created_at).toLocaleDateString()}</td></tr>
                  </tbody>
                </table>
              </div>
              <button className="btn btn-ghost" onClick={handleLogout} style={{ marginTop: 16 }}>
                Sign Out
              </button>
            </div>
          )}

          {/* Admin Team */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Admin Team</h2>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Last Active</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((a) => (
                    <tr key={a.id}>
                      <td>{a.display_name || "Unknown"}</td>
                      <td><code className={styles.mono}>{a.email}</code></td>
                      <td style={{ textTransform: "capitalize" }}>{a.role.replace("_", " ")}</td>
                      <td className={styles.dateCell}>{a.last_active_at ? new Date(a.last_active_at).toLocaleDateString() : "Never"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
