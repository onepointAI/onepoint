export const draggableStyle = (draggle: boolean) => {
  return {
    '-webkit-app-region': draggle ? 'drag' : 'no-drag',
  }
}
