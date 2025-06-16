const MEETING_SUBSCRIPTION = `
subscription MeetingSubscription {
    meeting {
        externalVideo {
            playerPlaying
            externalVideoUrl
        }
    }
}
`;

const USER_METADATA = `
 subscription {
    user_metadata {
        parameter
        value
    }
}
`;

export { MEETING_SUBSCRIPTION, USER_METADATA };
