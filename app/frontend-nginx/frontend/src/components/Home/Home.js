import React from "react";
import { useSelector } from "react-redux";
import InfoSection from "./InfoSection/InfoSection";
import { homeObjOne, homeObjTwo, homeObjThree } from "./InfoSection/Data";
import bg1 from "../../assets/images/HomePage/smart-agriculture-iot-with-hand-planting-tree-background.jpg";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation();
  const user = useSelector((state) => state.user.user);

  // 1. Fetch the full translated array once
  const homeTranslations = t("description.home", { returnObjects: true });

  // 2. Create fresh objects that keep the layout data from Data.js, 
  // but override the text props with the live translated strings.
  const sectionOneProps = {
    ...homeObjOne,
    topLine: homeTranslations[0],
    headline: homeTranslations[1],
    description: homeTranslations[2],
    buttonLabel: homeTranslations[3],
  };

  const sectionTwoProps = {
    ...homeObjTwo,
    topLine: homeTranslations[4],
    headline: homeTranslations[5],
    description: homeTranslations[6],
    buttonLabel: homeTranslations[7],
  };

  const sectionThreeProps = {
    ...homeObjThree,
    topLine: homeTranslations[8],
    headline: homeTranslations[9],
    description: homeTranslations[10],
    buttonLabel: homeTranslations[11],
  };

  return (
    <>
      {/* Hero Section - Full Width Grid */}
      <div className="w-full">
        <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col lg:flex-row items-center justify-center px-6 py-12 lg:py-0">
          {/* Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 right-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-10 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl"></div>
          </div>

          {/* Left Content Column */}
          <div className="flex-1 relative z-10 max-w-2xl">
            <div className="space-y-8">
              <div>
                <h1 className="text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-400 mb-6 py-4 leading-normal">
                  {t("description.heading.0")}
                </h1>
                <p className="text-xl text-slate-300 leading-relaxed max-w-lg">
                  {t("description.heading.1")}
                </p>
              </div>

              {/* Wrap the buttons in conditions based on user state */}
              <div className="flex gap-4 flex-wrap">
                
                {/* If NO user is logged in, show the Auth / Join Us link */}
                {!user && (
                  <Link
                    to="/auth"
                    className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold rounded-lg hover:shadow-lg hover:shadow-amber-500/30 transition-all transform hover:scale-105"
                  >
                    {t("description.heading.2")} →
                  </Link>
                )}

                {/* If A USER is logged in, ONLY show the Dashboard link */}
                {user && (
                  <Link
                    to="/dashboard"
                    className="px-8 py-4 border-2 border-amber-300 text-amber-300 font-bold rounded-lg hover:bg-amber-500/10 transition-all"
                  >
                    {t("viewDashboard")}
                  </Link>
                )}
                
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-amber-200/10">
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-300">40+</div>
                  <div className="text-sm text-slate-400">{t("Total Visitors")}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-300">98%</div>
                  <div className="text-sm text-slate-400">{t("accuracyRate")}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-300">10+</div>
                  <div className="text-sm text-slate-400">{t("cropTypes")}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Image Column */}
          <div className="flex-1 relative z-10 mt-12 lg:mt-0">
            <div
              className="relative h-96 lg:h-full min-h-96 rounded-2xl overflow-hidden shadow-2xl"
              style={{
                backgroundImage: `url(${bg1})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Sections */}
      {/* Pass the dynamically translated objects here */}
      <div className="w-full">
        <InfoSection {...sectionOneProps} />
      </div>
      <div className="w-full">
        <InfoSection {...sectionTwoProps} />
      </div>
      <div className="w-full">
        <InfoSection {...sectionThreeProps} />
      </div>
    </>
  );
};

export default Home;