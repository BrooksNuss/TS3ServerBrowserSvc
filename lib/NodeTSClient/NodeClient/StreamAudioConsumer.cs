using System;
using System.IO;
using TS3Client.Audio;
using NLog;

namespace NodeClient {
	class StreamAudioConsumer: IAudioPassiveConsumer {
		public bool Active { get; }
		private readonly Stream output;
		private static Logger logger = LogManager.GetLogger("AudioLogger");

		public StreamAudioConsumer(Stream output) {
			this.output = output;
		}

		// data from client
		public void Write(Span<byte> data, Meta meta) {
			if (output is null)
				return;

			// append talking client to output
			byte[] talkingClient = BitConverter.GetBytes(meta.In.Sender);
			byte[] buffer = new byte[data.Length + 2];
			buffer[0] = talkingClient[1];
			buffer[1] = talkingClient[0];
			data.ToArray().CopyTo(buffer, 2);

			output.Write(buffer, 0, buffer.Length);
		}
	}
}
