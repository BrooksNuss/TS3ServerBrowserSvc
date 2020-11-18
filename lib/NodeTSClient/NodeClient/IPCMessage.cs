using System;
using System.Collections.Generic;

namespace NodeClient {
	public class IPCMessage {
		public IPCMessageType type { get; set; }
		public string clid { get; set; }
		public IPCMessageDataType data { get; set; }
	}

	public interface IPCMessageDataType { }

	public class IPCMessageConnect : IPCMessageDataType {
		public string identity { get; set; }
		public string clientName { get; set; }
		public string channel { get; set; }
		public string channelPassword { get; set; }
		public string id { get; set; }
	}

	public class IPCMessageJoinChannel : IPCMessageDataType {
		public string cid { get; set; }
	}

	public class IPCMessageVoice : IPCMessageDataType {
		public byte[] buffer { get; set; }
	}

	public class IPCMessageEventArgs : EventArgs {
		public IPCMessageEventArgs(IPCMessage message) {
			this.message = message;
		}

		public IPCMessage message { get; set; }
	}

	public delegate void MessageReceivedHandler(IPCMessage message);

	//public class TSClientCommand : IPCMessage {
	//	public IPCMessageType Type { get; set; }
	//	public string[] Values { get; set; }
	//}

	// public enum IPCMessageType {
	// 	DISCONNECT,
	// 	CLIENT_MOVE,
	// 	TOGGLE_INPUT_MUTE,
	// 	TOGGLE_OUTPUT_MUTE
	// }

	//public static class IPCMessageType {
	//	public string DISCONNECT = "DISCONNECT";
	//	public string JOIN_CHANNEL = "JOIN_CHANNEL";
	//	public string TOGGLE_INPUT_MUTE = "TOGGLE_INPUT_MUTE";
	//	public string TOGGLE_OUTPUT_MUTE = "TOGGLE_OUTPUT_MUTE";
	//	public string CLIENT_ID = "CLIENT_ID";
	//}

	public enum IPCMessageType {
		CONNECT = 0,
		DISCONNECT = 1,
		JOIN_CHANNEL = 2,
		TOGGLE_MUTE_INPUT = 3,
		TOGGLE_MUTE_OUTPUT = 4,
		VAD_ACTIVE = 5,
		VAD_INACTIVE = 6,
		SEND_VOICE = 7,
		RECEIVE_VOICE = 8
	}
}
