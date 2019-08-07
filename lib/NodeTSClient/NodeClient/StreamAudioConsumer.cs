using System;
using System.IO;
using System.Threading;
using TS3Client;
using TS3Client.Audio;

namespace NodeClient {
	class StreamAudioConsumer: IAudioPassiveConsumer {
		public bool Active { get; }
		private readonly Stream output;

		public StreamAudioConsumer(Stream output) {
			this.output = output;
		}

		// data from client
		public void Write(Span<byte> data, Meta meta) {
			if (output is null)
				return;

			output.Write(data.ToArray(), 0, data.Length);
		}
	}
}
