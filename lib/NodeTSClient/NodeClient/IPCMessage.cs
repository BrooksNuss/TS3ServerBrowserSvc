namespace NodeClient {
	public interface IPCMessage {
		IPCMessageType Type { get; set; }
		string[] Values { get; set; }
	}

	public class TSClientCommand : IPCMessage {
		public IPCMessageType Type { get; set; }
		public string[] Values { get; set; }
	}

	public enum IPCMessageType {
		DISCONNECT,
		CLIENT_MOVE,
		TOGGLE_INPUT_MUTE,
		TOGGLE_OUTPUT_MUTE
	}
}
