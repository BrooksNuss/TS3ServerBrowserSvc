namespace NodeClient {
	public interface IPCMessage {
		IPCMessageType Type { get; set; }
		string[] Values { get; set; }
	}

	public class TSClientCommand : IPCMessage {
		public IPCMessageType Type { get; set; }
		public string[] Values { get; set; }
	}

	// public enum IPCMessageType {
	// 	DISCONNECT,
	// 	CLIENT_MOVE,
	// 	TOGGLE_INPUT_MUTE,
	// 	TOGGLE_OUTPUT_MUTE
	// }

	public static class IPCMessageType {
		public string DISCONNECT = "DISCONNECT";
		public string JOIN_CHANNEL = "JOIN_CHANNEL";
		public string TOGGLE_INPUT_MUTE = "TOGGLE_INPUT_MUTE";
		public string TOGGLE_OUTPUT_MUTE = "TOGGLE_OUTPUT_MUTE";
		public string CLIENT_ID = "CLIENT_ID";
	}
}
