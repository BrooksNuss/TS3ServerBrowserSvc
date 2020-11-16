using System;
using System.IO;
using Newtonsoft.Json;
using NLog;
using TSLib.Audio;
using TSLib.Full;

namespace NodeClient {
	class StreamAudioConsumer: IAudioPassiveConsumer {
		public bool Active { get; }
		//private Func<IPCMessage<IPCMessageDataType>, null> receiveDelegate;
		private TsFullClient client;
		private MessageReceivedHandler handler;
		private static Logger logger = LogManager.GetLogger("AudioLogger");

		public StreamAudioConsumer(TsFullClient client, MessageReceivedHandler handler) {
			this.client = client;
			this.handler = handler;
		}

		// data from client
		public void Write(Span<byte> data, Meta meta) {
			//if (output is null)
			//	return;

			// append talking client to output
			byte[] talkingClient = BitConverter.GetBytes(meta.In.Sender.Value);
			byte[] buffer = new byte[data.Length + 2];
			buffer[0] = talkingClient[1];
			buffer[1] = talkingClient[0];
			data.ToArray().CopyTo(buffer, 2);
			IPCMessage voiceMessage = createVoiceIPCMessageEvent(buffer);
			this.HandleVoiceMessage(voiceMessage);
			//output.Write(buffer, 0, buffer.Length);
		}

		private IPCMessage createVoiceIPCMessageEvent(byte[] buffer) {
			IPCMessage message = new IPCMessage() {
				type = IPCMessageType.RECEIVE_VOICE,
				clid = client.ClientId.ToString()
			};
			message.data = new IPCMessageVoice() {
				buffer = buffer
			};
			return message;
		}

		private void HandleVoiceMessage(IPCMessage message) {
			this.handler(message);
		}
	}
}
