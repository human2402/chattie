function ConnectionState({ isConnected }: { isConnected: boolean }) {
  return (
    <div>
      <p> {isConnected ? "Connected" : "Disconnected"} </p>
    </div>
  )
}

export default ConnectionState;
