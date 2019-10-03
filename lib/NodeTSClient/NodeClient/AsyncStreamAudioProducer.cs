namespace NodeClient {
	using System;
	using System.IO;
	using TS3Client.Audio;
	using TS3Client;
	class AsyncStreamAudioProducer: IAudioActiveProducer {
		private readonly Stream stream;
		private bool running = false;
		Meta meta = new Meta();
		public IAudioPassiveConsumer OutStream { get; set; }
		private byte[] readBuffer = Array.Empty<byte>();
		public int ReadBufferSize = 960;

		public AsyncStreamAudioProducer(Stream stream) {
			this.stream = stream;
			readBuffer = new byte[ReadBufferSize];
			running = true;
			meta.Codec = Codec.OpusVoice;
			meta.Out = new MetaOut();
			meta.Out.SendMode = TargetSendMode.Voice;
			Initialize();
		}

		async private void Initialize() {
			while (this.running) {
				await stream.ReadAsync(readBuffer, 0, ReadBufferSize);
				this.OutStream.Write(readBuffer.AsSpan(), meta);
			}
		}
	}
}
