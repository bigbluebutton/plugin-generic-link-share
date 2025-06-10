interface DecreaseVolumeOnSpeakProps {
    pluginName: string,
    pluginUuid: string,
}

interface ExternalVideoMeetingSubscription {
    meeting: {
        externalVideo: {
            playerPlaying: boolean
            externalVideoUrl: string
        }
    }[]
}

interface DataToGenericLink {
    isUrlSameForRole: boolean;
    url: string;
    viewerUrl?: string
}

export interface UserMetadata {
    parameter: string;
    value: string;
}

export interface UserMetadataGraphqlResponse {
    user_metadata: UserMetadata[];
}

export { DecreaseVolumeOnSpeakProps, ExternalVideoMeetingSubscription, DataToGenericLink };
