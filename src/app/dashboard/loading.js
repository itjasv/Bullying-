import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import styles from "./dashboard.module.css";

export default function DashboardLoading() {
  return (
    <>
      <Navbar />
      <div className={styles.page}>
        <div className={styles.container}>
          <p className={styles.soul}>welcome back</p>
          <h1 className={styles.heading}>Dashboard</h1>
          
          {/* Profile Card Skeleton */}
          <div className={styles.profileCard} style={{ opacity: 0.7 }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className={styles.profileRow}>
                <div className="skeleton" style={{ width: 60, height: 16 }} />
                <div className="skeleton" style={{ width: 140, height: 16 }} />
              </div>
            ))}
          </div>

          {/* Report History Skeleton */}
          <div className={styles.historySection} style={{ opacity: 0.7 }}>
            <h2 className={styles.historyTitle}>Your Reports</h2>
            <div className="skeleton" style={{ width: "100%", height: 16, marginBottom: 8 }} />
            <div className="skeleton" style={{ width: "70%", height: 16, marginBottom: 32 }} />

            <div className={styles.reportList}>
              {[...Array(2)].map((_, i) => (
                <div key={i} className={styles.reportCard}>
                  <div className={styles.reportHeader}>
                    <div className="skeleton" style={{ width: 120, height: 24 }} />
                    <div className="skeleton" style={{ width: 80, height: 24, borderRadius: 12 }} />
                  </div>
                  <div className={styles.reportMeta} style={{ marginTop: 16 }}>
                    <div className="skeleton" style={{ width: 220, height: 14 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
