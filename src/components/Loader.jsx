// src/components/Loader.jsx
export default function Loader() {
  return (
    <div style={styles.overlay}>
      <div style={styles.spinner}></div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0, 0, 0, 0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  spinner: {
    width: "60px",
    height: "60px",
    border: "6px solid rgba(255,255,255,0.3)",
    borderTop: "6px solid #ffcc70",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};
