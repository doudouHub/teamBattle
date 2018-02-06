export const allReadyStart = state => {
    return state.otherIsReady && state.count_over;
}
