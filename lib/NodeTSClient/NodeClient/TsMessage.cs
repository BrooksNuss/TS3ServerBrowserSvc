using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NodeClient {
	class TsMessage<T> {
		public TsMessageType messageType;
		public T data;
	}

	enum TsMessageType {
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

	abstract class TsMessageData {
		public string clid;
	}

	class TsClientConnectMessageData:TsMessageData {
		public string identity;
		public string clientName;
		public string channel;
		public string channelPassword;
		public string id;
	}

	class TsClientDisconnectMessageData:TsMessageData {
		public string reason;
	}
}
