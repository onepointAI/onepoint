export const draggableStyle = (draggle: boolean) => {
  return {
    WebkitAppRegion: draggle ? 'drag' : 'no-drag',
  }
}
