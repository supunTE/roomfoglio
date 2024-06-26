import { assets } from "../../../../assets";
import { Window } from "../window";

import { ProfileInfo } from "./ProfileInfo";
import { SocialSection } from "./SocialSection";

export function Profile(): JSX.Element {
  return (
    <Window id="profile">
      <div className="overflow-y-scroll overflow-x-hidden interface-scrollbar 2md:flex 2md:flex-row h-full 2md:overflow-hidden">
        <div className="bg-white/80 w-full 2md:h-full flex flex-col interface-scrollbar overflow-y-auto 2md:w-2/5 lg:w-1/3 2xl:w-1/4 3xl:w-1/5 min-w-64 lg:min-w-80 p-4">
          <div className="relative">
            <img
              className="rounded-lg overflow-hidden bg-cover"
              src={assets.photo}
              alt="profile-img"
            />
            <div className="absolute -bottom-4 flex justify-between w-full px-2">
              <span className="text-black text-sm text-center w-full border border-gray-400 shadow-sm bg-white p-1 rounded-md ">
                😉 Love to Learn!
              </span>
            </div>
          </div>
          <h1 className="text-black font-bold text-2xl py-4 mt-4 text-center jetbrains-mono">
            Supun Tharinda Edirisuriya
            <div className="text-sm">(supTE)</div>
            <div className="text-xs mt-2 text-gray-500">He/him</div>
          </h1>
          <h5 className="text-black text-center text-sm">
            <span className="hover:text-green-800 transition-colors duration-300">
              Developer
            </span>
            {` | `}
            <span className="hover:text-purple-800 transition-colors duration-300">
              Designer
            </span>
          </h5>
          <SocialSection />
        </div>
        <div className="w-full">
          <ProfileInfo />
        </div>
      </div>
    </Window>
  );
}
