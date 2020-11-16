namespace NodeClient {
	using System;
	using System.IO;
	using TSLib.Audio;
	using TSLib;
	class AsyncStreamAudioProducer: IAudioActiveProducer {
		private readonly Stream inStream;
		private bool running = false;
		Meta meta = new Meta();
		public IAudioPassiveConsumer OutStream { get; set; }
		private byte[] readBuffer = Array.Empty<byte>();
		public int ReadBufferSize = 960;

		public AsyncStreamAudioProducer(Stream inStream, IAudioPassiveConsumer outStream) {
			this.inStream = inStream;
			this.OutStream = outStream;
			readBuffer = new byte[ReadBufferSize];
			running = true;
			meta.Codec = Codec.OpusVoice;
			meta.Out = new MetaOut();
			meta.Out.SendMode = TargetSendMode.Voice;
			//Initialize();
		}

		//async private void Initialize() {
		//	while (running) {
		//		await inStream.ReadAsync(readBuffer, 0, ReadBufferSize);
		//		//OutStream.Write(readBuffer.AsSpan(), meta);
		//	}
		//}

		public void Write(byte[] buffer) {
			OutStream.Write(buffer, meta);
		}
	}
}
