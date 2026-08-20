import Brand from "./Brand.jsx";

const AuthLayout = ({ eyebrow, title, subtitle, children }) => {
  return (
    <div className="min-h-svh bg-canvas lg:grid lg:grid-cols-[minmax(22rem,0.88fr)_minmax(34rem,1.12fr)]">
      <aside className="relative hidden min-h-svh overflow-hidden bg-ink p-10 lg:flex lg:flex-col lg:justify-between xl:p-14">
        <img
          className="absolute inset-0 h-full w-full object-cover object-center"
          src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=85"
          alt="Friends sharing a conversation outdoors"
        />
        <div className="absolute inset-0 bg-[#102a27]/70" aria-hidden="true" />

        <div className="relative z-10">
          <Brand light />
        </div>

        <div className="relative z-10 max-w-md">
          <div className="mb-6 h-1 w-14 rounded-full bg-sun" />
          {/* <p className="font-display text-[2.5rem] leading-[1.12] font-semibold text-white xl:text-5xl">
            Some conversations deserve more than a notification.
          </p>
          <p className="mt-5 max-w-sm text-base leading-7 text-white/75">
            Pull up a chair. Someone is listening.
          </p> */}
        </div>
      </aside>

      <main className="flex min-h-svh items-center justify-center px-5 py-10 sm:px-10 lg:px-14">
        <div className="rise-in w-full max-w-[29rem]">
          <div className="mb-12 lg:hidden">
            <Brand />
          </div>

          <p className="text-sm font-bold text-brand uppercase">{eyebrow}</p>
          <h1 className="mt-3 font-display text-[2.25rem] leading-[1.15] font-bold text-ink sm:text-[2.6rem]">
            {title}
          </h1>
          <p className="mt-3 text-[15px] leading-6 text-muted sm:text-base">{subtitle}</p>

          <div className="mt-8">{children}</div>
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;