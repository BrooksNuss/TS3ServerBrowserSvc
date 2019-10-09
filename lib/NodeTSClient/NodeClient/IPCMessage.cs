namespace NodeClient {
	interface IPCMessage {
		IPCMessageType Type { get; set; }
		string[] Values { get; set; }
	}

	enum IPCMessageType {
		DISCONNECT,
		CLIENT_MOVE,
		TOGGLE_INPUT_MUTE,
		TOGGLE_OUTPUT_MUTE
	}
}
