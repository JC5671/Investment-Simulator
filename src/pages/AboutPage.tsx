export default function AboutPage() {
  return (
    <div className="flex justify-center mb-10">
      <div
        className="
      bg-gray-900/30 backdrop-blur-2xl border border-white/20 p-12 rounded-xl
		  w-full max-w-7xl text-white space-y-10
      transition-shadow duration-300 hover:shadow-[0_0_30px_rgba(100,180,255)]"
      >
        {/* Title */}
        <h1 className="text-4xl font-bold text-center text-[rgb(100,180,255)] mb-8">
          About This Project
        </h1>

        {/* Motivation */}
        <section>
          <h2 className="text-2xl font-semibold text-[rgb(100,180,255)] mb-3">
            Motivation
          </h2>

          <p className=" mb-3">
            I’ve always been fascinated by personal finance and investing,
            particularly how market variability shapes long-term outcomes.
            Inspired by{" "}
            <a
              href="http://www.moneychimp.com/calculator/compound_interest_calculator.htm"
              className="text-[rgb(100,180,255)] underline"
            >
              MoneyChimp’s Compound Interest Calculator
            </a>
            , I wanted to create something grounded in real data, not just
            theoretical assumptions. Thus, this project was born.
          </p>

          <p className="mb-3">
            This project is an{" "}
            <span className="text-[rgb(100,180,255)]">
              Interactive Investment Simulator
            </span>{" "}
            that models portfolio growth using real reconstructed{" "}
            <span className="text-[rgb(100,180,255)]">S&P 500</span> data from
            1927 to 2025. Unlike traditional compound interest calculators that
            assume constant returns, this simulator incorporates the randomness
            of real markets through{" "}
            <span className="text-[rgb(100,180,255)]">
              Monte Carlo Simulations
            </span>
            .
          </p>
        </section>

        {/* Key Features */}
        <section>
          <h2 className="text-2xl font-semibold text-[rgb(100,180,255)] mb-3">
            Key Features
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <span className="text-[rgb(100,180,255)]">
                Single Page Application (SPA)
              </span>{" "}
              with responsive glassy UI
            </li>
            <li>
              Utilizes real reconstructed{" "}
              <span className="text-[rgb(100,180,255)]">S&P 500</span> monthly
              data (1927–2025)
            </li>
            <li>Supports monthly contributions and withdrawals</li>
            <li>
              Interactive{" "}
              <span className="text-[rgb(100,180,255)]">
                simulation timeline chart
              </span>
            </li>
            <li>
              Interactive histogram of{" "}
              <span className="text-[rgb(100,180,255)]">
                final portfolio distributions
              </span>
            </li>
            <li>
              <span className="text-[rgb(100,180,255)]">
                Risk probability analysis
              </span>{" "}
              and interpretation
            </li>
          </ul>
        </section>

        {/* Technical Achievements */}
        <section>
          <h2 className="text-2xl font-semibold text-[rgb(100,180,255)] mb-3">
            Technical Achievements
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <span className="text-[rgb(100,180,255)] font-bold">
                Web Development:
              </span>{" "}
              Built as a responsive{" "}
              <span className="text-[rgb(100,180,255)]">
                Single Page Application (SPA)
              </span>{" "}
              using <span className="text-[rgb(100,180,255)]">React</span> and{" "}
              <span className="text-[rgb(100,180,255)]">TypeScript</span>,
              featuring a glassy, translucent interface with smooth gradients,
              and a cool blue glow theme, styled with{" "}
              <span className="text-[rgb(100,180,255)]">Tailwind CSS</span>.
            </li>
            <li>
              <span className="text-[rgb(100,180,255)] font-bold">
                Simulation Engine:
              </span>{" "}
              Applied the{" "}
              <span className="text-[rgb(100,180,255)]">
                Monte Carlo Method
              </span>{" "}
              to randomly sample monthly returns from{" "}
              <span className="text-[rgb(100,180,255)]">S&P 500</span> data, and
              generate{" "}
              <span className="text-[rgb(100,180,255)]">
                10,000 independent simulations
              </span>
              , leveraging the{" "}
              <span className="text-[rgb(100,180,255)]">
                law of large numbers
              </span>{" "}
              for stable results.
            </li>
            <li>
              <span className="text-[rgb(100,180,255)] font-bold">
                Data Visualization:
              </span>{" "}
              Interactive charts built with{" "}
              <span className="text-[rgb(100,180,255)]">Recharts</span> that
              display the{" "}
              <span className="text-[rgb(100,180,255)]">
                simulation timeline chart
              </span>
              , a histogram of{" "}
              <span className="text-[rgb(100,180,255)]">
                final portfolio distributions
              </span>
              , and{" "}
              <span className="text-[rgb(100,180,255)]">
                risk probability analysis
              </span>{" "}
              with clear interpretations.
            </li>
          </ul>
        </section>

        {/* Reflection */}
        <section>
          <h2 className="text-2xl font-semibold text-[rgb(100,180,255)] mb-3">
            Reflection & Learnings
          </h2>
          <p className=" mb-3">
            This project deepened my understanding of both{" "}
            <span className="text-[rgb(100,180,255)]">
              quantitative finance
            </span>{" "}
            and{" "}
            <span className="text-[rgb(100,180,255)]">
              modern front-end development
            </span>
            . I learned to combine{" "}
            <span className="text-[rgb(100,180,255)]">Monte Carlo theory</span>{" "}
            with real-world coding practices in{" "}
            <span className="text-[rgb(100,180,255)]">React</span>, managing
            both computation and rendering performance.
          </p>
          <p>
            On a personal note, this project reaffirmed that finance and
            technology share a common language,{" "}
            <span className="text-[rgb(100,180,255)]">data</span>. Simulating
            thousands of market outcomes showed how code can make uncertainty
            visible and actionable.
          </p>
        </section>

        {/* Future Improvements */}
        <section>
          <h2 className="text-2xl font-semibold text-[rgb(100,180,255)] mb-3">
            Future Improvements
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Offload simulations to{" "}
              <span className="text-[rgb(100,180,255)]">Web Workers</span> for
              smoother UI
            </li>
            <li>Add stock/bond allocation options for realism</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
