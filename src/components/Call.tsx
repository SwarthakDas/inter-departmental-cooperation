"use client" 
import React from 'react'

import AgoraRTC, {
  AgoraRTCProvider,
  LocalVideoTrack,
  RemoteUser,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRTCClient,
  useRemoteAudioTracks,
  useRemoteUsers,
} from "agora-rtc-react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function Videos(props: { channelName: string; AppID: string }) {
    const { AppID, channelName } = props;
    const { isLoading: isLoadingMic, localMicrophoneTrack } =
      useLocalMicrophoneTrack();
    const { isLoading: isLoadingCam, localCameraTrack } = useLocalCameraTrack();
    const remoteUsers = useRemoteUsers();
    const { audioTracks } = useRemoteAudioTracks(remoteUsers);
  
    usePublish([localMicrophoneTrack, localCameraTrack]);
    useJoin({
      appid: AppID,
      channel: channelName,
      token: null,
    });
  
    audioTracks.map((track) => track.play());
    const deviceLoading = isLoadingMic || isLoadingCam;
    if (deviceLoading)
      return (
        <div className="flex flex-col items-center pt-40">Loading devices...</div>
      );
    const unit = "minmax(0, 1fr) ";
  
    return (
      <div className="flex flex-col justify-between w-full h-screen p-1">
        <div
          className={`grid  gap-1 flex-1`}
          style={{
            gridTemplateColumns:
              remoteUsers.length > 9
                ? unit.repeat(4)
                : remoteUsers.length > 4
                ? unit.repeat(3)
                : remoteUsers.length > 1
                ? unit.repeat(2)
                : unit,
          }}
        >
          <LocalVideoTrack
            track={localCameraTrack}
            play={true}
            className="w-full h-full"
          />
          {remoteUsers.map((user,index) => (
            <RemoteUser key={index} user={user} />
          ))}
        </div>
      </div>
    );
  }

const Call = (props) => {
    const client = useRTCClient(AgoraRTC.createClient({ codec: "vp8", mode: "rtc" }));
    const pathname = usePathname();
    const baseUrl = pathname.startsWith('/employee-dashboard/')? `/employee-dashboard/employee=${pathname.split('/')[2]}`
  : '/';
  return (
    <div>
      <AgoraRTCProvider client={client}>
      <Videos channelName={props.channelName} AppID={props.appId} />
      <div className="fixed z-10 bottom-0 left-0 right-0 flex justify-center pb-4">
        <Link className="px-5 py-3 text-base font-medium text-center text-white bg-red-400 rounded-lg hover:bg-red-500 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900 w-40" href={baseUrl}>End Call</Link>
      </div>
    </AgoraRTCProvider>
    </div>
  )
}

export default Call
