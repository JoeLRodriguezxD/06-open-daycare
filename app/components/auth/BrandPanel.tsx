export function BrandPanel() {
  return (
    <div
      className="relative hidden flex-col justify-between overflow-hidden p-14 text-white md:flex"
      style={{
        background:
          "linear-gradient(155deg, var(--auth-panel-start) 0%, var(--auth-panel-mid) 45%, var(--auth-panel-end) 100%)",
        padding: "56px 60px",
      }}
    >
      <div
        aria-hidden="true"
        className="absolute rounded-full"
        style={{
          width: "420px",
          height: "420px",
          background: "rgba(255,255,255,.12)",
          top: "-140px",
          right: "-120px",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute rounded-full"
        style={{
          width: "300px",
          height: "300px",
          background: "rgba(255,255,255,.10)",
          bottom: "-110px",
          left: "-80px",
        }}
      />

      <div className="relative flex items-center gap-[13px]">
        <div
          aria-hidden="true"
          className="flex h-[46px] w-[46px] items-center justify-center rounded-[14px]"
          style={{ background: "rgba(255,255,255,.22)" }}
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </svg>
        </div>
        <span className="font-display text-[21px] font-semibold tracking-[0.5px]">
          OpenDayCare
        </span>
      </div>

      <div className="relative">
        <h1 className="font-display m-0 mb-[18px] text-[42px] leading-[1.12] font-semibold">
          El día de cada niño,
          <br />
          compartido con su familia.
        </h1>
        <p
          className="m-0 max-w-[430px] text-[17px] leading-[1.6]"
          style={{ color: "rgba(255,255,255,.92)" }}
        >
          Publicá momentos, gestioná las salas y mantené a las familias cerca,
          desde un solo lugar.
        </p>
      </div>

      <div
        className="relative text-sm"
        style={{ color: "rgba(255,255,255,.9)" }}
      >
        🌿 Guardería Sala Soles
      </div>
    </div>
  );
}
