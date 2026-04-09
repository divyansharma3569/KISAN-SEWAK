import React, { useState } from "react";
import { Switch } from "@headlessui/react";
import Login from "./Login";
import Signup from "./Signup";
import cropbg from "../../assets/images/LoginSignupPage/background4.png";

import { useTranslation } from "react-i18next";

function Auth() {
  const { t } = useTranslation();
  const [enabled, setEnabled] = useState(false);
  
  return (
    <div
      className="grid grid-cols-4 h-full bg-blend-darken relative"
      style={{
        backgroundImage: "url(" + cropbg + ")",
        backgroundPosition: "center",
      }}
    >
      <div
        className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 rounded-r-[900px] absolute h-full "
        style={{
          borderRadius: "54% 46% 100% 0% / 0% 100% 0% 100% ",
          width: "45%",
        }}
      ></div>
      <div
        className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-r-[900px] absolute h-full opacity-80"
        style={{
          borderRadius: "45% 55% 100% 0% / 0% 100% 0% 100% ",
          width: "44%",
        }}
      ></div>
      
      {/* Changed width and padding to make the card perfectly squarish and centered */}
      <div className="col-span-4 md:col-start-3 md:col-span-2 py-auto flex justify-center items-center">
        <div className="mx-auto w-11/12 sm:w-3/4 lg:w-2/3 xl:w-1/2" style={{zIndex:'1'}}>
          <div className="flex flex-col gap-6 p-8 rounded-3xl border border-amber-200/20 bg-slate-950/85 backdrop-blur-md shadow-2xl shadow-slate-950/40">
            
            {/* Toggle Switch */}
            <div className="flex justify-center">
              <Switch
                checked={enabled}
                onChange={setEnabled}
              >
                <span
                  className="bg-slate-800 rounded-full h-12 w-56 flex relative shadow-inner shadow-black/40 p-1"
                >
                  <span
                    className={`flex justify-center items-center h-full w-1/2 rounded-full transition-colors duration-300 text-sm font-medium z-10 ${!enabled ? 'text-slate-950 font-bold' : 'text-white'
                      }`}
                  >
                    {t('description.auth.2')}
                  </span>
                  <span
                    className={`flex justify-center items-center h-full w-1/2 rounded-full transition-colors duration-300 text-sm font-medium z-10 ${enabled ? 'text-slate-950 font-bold' : 'text-white'
                      }`}
                  >
                    {t('description.auth.3')}
                  </span>
                  <span
                    className={`absolute left-1 top-1 h-10 w-[108px] rounded-full transition-transform duration-300 ease-in-out bg-gradient-to-r from-amber-300 to-orange-500 shadow-md ${enabled ? 'translate-x-full' : 'translate-x-0'
                      }`}
                  >
                  </span>
                </span>
              </Switch>
            </div>
            
            {/* Form Container */}
            <div className="mt-2">
              {enabled ? <Login /> : <Signup />}
            </div>
            
            {/* Removed the Social Icons row completely! */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;