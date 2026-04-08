import { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { useTranslation } from "react-i18next";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

// 1. Limited to only English and Hindi
const lngs = {
  EN: { nativeName: "English" },
  ह: { nativeName: "Hindi" },
};

export default function LanguageSelector() {
  const { t, i18n } = useTranslation();
  const [activeLanguage, setActiveLanguage] = useState(
    i18n.resolvedLanguage ? i18n.resolvedLanguage.toUpperCase() : "EN"
  );
  
  const changeLanguage = (lng) => {
    setActiveLanguage(lng.toUpperCase());
    i18n.changeLanguage(lng);
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="w-10 h-10 rounded-full border border-amber-300/40 shadow-lg shadow-slate-950/30 px-4 py-2 bg-slate-900 text-sm font-medium text-amber-200 hover:bg-amber-300 hover:text-slate-950 flex justify-center items-center transition-colors">
          <span>{activeLanguage}</span>
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        {/* 2. Changed right-0 to left-0 and origin-top-right to origin-top-left so it opens on-screen */}
        {/* Added z-50 to ensure it overlaps other dashboard elements */}
        <Menu.Items className="origin-top-left absolute left-0 mt-2 w-56 rounded-2xl shadow-2xl bg-slate-900 ring-1 ring-amber-200/10 focus:outline-none overflow-hidden z-50">
          <div className="py-1">
            {Object.keys(lngs).map((lng) => (
              <Menu.Item key={lng}>
                {({ active }) => (
                  <button
                    onClick={() => changeLanguage(lng)}
                    className={classNames(
                      active ? "bg-amber-300/10 text-amber-100" : "text-slate-200",
                      "block w-full text-left px-4 py-3 text-sm"
                    )}
                  >
                    {lngs[lng].nativeName}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}