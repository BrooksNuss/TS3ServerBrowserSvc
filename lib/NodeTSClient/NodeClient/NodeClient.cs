using System;
using System.IO;
using System.Threading;
using TS3Client;
using TS3Client.Full;
using TS3Client.Audio;

namespace NodeClient
{
	class NodeClient
	{
		static void Main(string[] args)
		{
			//Thread.Sleep(20000);
			Ts3FullClient client = new Ts3FullClient(TS3Client.EventDispatchType.DoubleThread);
			VersionSign version = VersionSign.VER_WIN_3_2_3;
			IdentityData identity;
			//if (args.Length > 1 && args[1] != null) {
			//	identity = Ts3Crypt.LoadIdentityDynamic(args[1]).Value;
			//} else {
				identity = Ts3Crypt.GenerateNewIdentity();
			//}
			var connectionConfig = new ConnectionDataFull
			{
				Username = "TSWebClient",
				ServerPassword = null,
				Address = "3.213.117.224",
				Identity = identity,
				VersionSign = version,
				DefaultChannel = "/25",
				DefaultChannelPassword = null,
			};
			client.Connect(connectionConfig);
			Stream stdin = Console.OpenStandardInput();
			Stream stdout = Console.OpenStandardOutput();
			int ScaleBitrate(int value) => Math.Min(Math.Max(1, value), 255) * 1000;
			// get audio stream and pipe it into target. Target will then use the client's sendAudio function.
			StreamAudioProducer streamInPipe = new StreamAudioProducer(stdin);
			TargetPipe targetPipe = new TargetPipe(streamInPipe, client);
			CheckActivePipe activePipe = new CheckActivePipe();
			EncoderPipe encoderPipe = new EncoderPipe(Codec.OpusVoice) { Bitrate = ScaleBitrate(48) };
			targetPipe.Chain(activePipe).Chain(encoderPipe).Chain(client);
			// get audio from client's outStream
			StreamAudioConsumer streamOutPipe = new StreamAudioConsumer(stdout);
			client.OutStream = streamOutPipe;
		}
	}
}
