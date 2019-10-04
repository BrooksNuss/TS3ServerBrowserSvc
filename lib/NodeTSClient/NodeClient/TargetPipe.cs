using System;
using System.Runtime.InteropServices;
using TS3Client.Audio;
using TS3Client.Commands;
using TS3Client.Full;

namespace NodeClient {
	internal class TargetPipe: IAudioActiveProducer, IAudioPassiveConsumer {
		public bool Active { get { return true; } }
		public IAudioPassiveConsumer OutStream { get; set; }
		private Ts3FullClient client;

		public TargetPipe(IAudioPassiveConsumer outStream, Ts3FullClient client) {
			OutStream = outStream;
			this.client = client;
		}

		public void Write(Span<byte> data, Meta meta) {
			Span<ulong> value = MemoryMarshal.Cast<byte, ulong>(data.Slice(1, 2));
			switch (data[0]) {
				case 0: OutStream.Write(data.Slice(1), meta); break;
				case 1: client.Disconnect(); break;
				case 2: client.ClientMove(client.ClientId, value[0]); break;
				case 3: client.Send("clientupdate", new CommandParameter("client_input_muted", data[3] != 0)); break;
				case 4: client.Send("clientupdate", new CommandParameter("client_output_muted", data[3] != 0)); break;
				// more client instructions go here
			}
		}
	}
}
