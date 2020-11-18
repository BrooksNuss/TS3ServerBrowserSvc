using System;
using System.IO;
using TSLib;
using TSLib.Audio;
using TSLib.Full;

namespace NodeClient {
	class TsClientAudioSetup {
		private TsFullClient client;
		private MessageReceivedHandler handler;
		private AsyncStreamAudioProducer streamInPipe;

		public TsClientAudioSetup(TsFullClient client, MessageReceivedHandler handler) {
			this.client = client;
			this.handler = handler;

			//setup audio
			Stream stdin = Console.OpenStandardInput();
			//Stream stdout = Console.OpenStandardOutput();
			int ScaleBitrate(int value) => Math.Min(Math.Max(1, value), 255) * 1000;
			CheckActivePipe activePipe = new CheckActivePipe();
			this.streamInPipe = new AsyncStreamAudioProducer(stdin, activePipe);
			EncoderPipe encoderPipe = new EncoderPipe(Codec.OpusVoice) { Bitrate = ScaleBitrate(48) };
			//TargetPipe targetPipe = new TargetPipe(encoderPipe, client);
			activePipe.Chain(encoderPipe).Chain(client);
			AudioPacketReader packetReader = new AudioPacketReader();
			DecoderPipe decoderPipe = new DecoderPipe();
			StreamAudioConsumer streamOutPipe = new StreamAudioConsumer(client, handler);
			client.OutStream = packetReader;
			packetReader.Chain(decoderPipe);
			decoderPipe.Chain(streamOutPipe);
		}

		private void HandleTeamspeakMessage(IPCMessage message) {
			this.handler(message);
		}

		public void sendVoiceMessage(IPCMessageVoice message) {
			streamInPipe.Write(message.buffer);
		}

		public void Disconnect() {
			this.client.Disconnect();
		}

		public void MoveChannel(string cid) {
			if (ulong.TryParse(cid, out ulong parsedCid)) {
				this.client.ChannelMove(new ChannelId(parsedCid));
			} else {
				Console.WriteLine("Invalid cid");
			}
		}
	}
}
