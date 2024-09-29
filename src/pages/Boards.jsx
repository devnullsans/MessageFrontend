import React from 'react';

function Boards() {
  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-[#111418] dark justify-between group/design-root overflow-x-hidden"
      style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}
    >
      <div>
        <div className="flex items-center bg-[#111418] p-4 pb-2 justify-between">
          <div className="flex size-12 shrink-0 items-center">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8"
              style={{
                backgroundImage:
                  'url("https://cdn.usegalileo.ai/stability/59c6c6fa-e95f-4cb1-a87c-478a1f4b117c.png")',
              }}
            ></div>
          </div>
          <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">
            Messages
          </h2>
        </div>

        <div className="px-4 py-3">
          <label className="flex flex-col min-w-40 h-12 w-full">
            <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
              <div
                className="text-[#9dabb8] flex border-none bg-[#293038] items-center justify-center pl-4 rounded-l-xl border-r-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                </svg>
              </div>
              <input
                placeholder="Search messages"
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border-none bg-[#293038] focus:border-none h-full placeholder:text-[#9dabb8] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                value=""
              />
            </div>
          </label>
        </div>

        {[
          {
            name: 'Ava Martinez',
            message: "Hey, I'm looking for a front-end engineer. Let me know if you have any referrals.",
            image: 'https://cdn.usegalileo.ai/stability/ca159c6c-954c-4f6c-a9f9-19cde08fce93.png',
            time: '2d',
          },
          {
            name: 'Product MGMT',
            message: "We're starting the planning process for next quarter, please submit your team's OKRs by Friday.",
            image: 'https://cdn.usegalileo.ai/stability/1e6dea88-7049-4463-b578-1116b3aa1407.png',
            time: '3d',
          },
          {
            name: 'Design Team',
            message: 'New design is up for review: https://www.notion.so/...',
            image: 'https://cdn.usegalileo.ai/stability/3dc7587c-12ac-4bd6-a12b-045e68aeb915.png',
            time: '5d',
          },
          {
            name: 'Engineering',
            message: 'We are moving our weekly engineering meeting to Thursday at 10am PT.',
            image: 'https://cdn.usegalileo.ai/stability/bf15029c-fcc2-4a7c-9a8c-e9720642b4cf.png',
            time: '1w',
          },
        ].map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-4 bg-[#111418] px-4 min-h-[72px] py-2 justify-between"
          >
            <div className="flex items-center gap-4">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-14 w-fit"
                style={{ backgroundImage: `url(${item.image})` }}
              ></div>
              <div className="flex flex-col justify-center">
                <p className="text-white text-base font-medium leading-normal line-clamp-1">
                  {item.name}
                </p>
                <p className="text-[#9dabb8] text-sm font-normal leading-normal line-clamp-2">
                  {item.message}
                </p>
              </div>
            </div>
            <div className="shrink-0">
              <p className="text-[#9dabb8] text-sm font-normal leading-normal">{item.time}</p>
            </div>
          </div>
        ))}
      </div>

      <div>
        <div className="flex gap-2 border-t border-[#293038] bg-[#1c2126] px-4 pb-3 pt-2">
          <a className="just flex flex-1 flex-col items-center justify-end gap-1 rounded-full text-white" href="#">
            <div className="text-white flex h-8 items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path
                  d="M224,115.55V208a16,16,0,0,1-16,16H168a16,16,0,0,1-16-16V168a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v40a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V115.55a16,16,0,0,1,5.17-11.78l80-75.48.11-.11a16,16,0,0,1,21.53,0,1.14,1.14,0,0,0,.11.11l80,75.48A16,16,0,0,1,224,115.55Z"
                ></path>
              </svg>
            </div>
            <p className="text-white text-xs font-medium leading-normal tracking-[0.015em]">Home</p>
          </a>
          {/* Repeat for Boards, Inbox, You */}
        </div>
        <div className="h-5 bg-[#1c2126]"></div>
      </div>
    </div>
  );
}

export default Boards;
