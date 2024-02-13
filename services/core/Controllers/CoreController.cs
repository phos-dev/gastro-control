using System;
using Microsoft.AspNetCore.Mvc;
using QRCoder;
using System.Drawing;
using System.IO;
using core.Contexts;
using core.Models;

namespace core.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CoreController : ControllerBase
    {

        [HttpGet]
        public IActionResult Generate(string content)
        {
            using (QRCodeGenerator qrGenerator = new QRCodeGenerator())
            {
                QRCodeData qrCodeData = qrGenerator.CreateQrCode(content, QRCodeGenerator.ECCLevel.Q);
                using (QRCode qrCode = new QRCode(qrCodeData))
                {
                    using (Bitmap bitmap = qrCode.GetGraphic(20))
                    {
                        using (MemoryStream ms = new MemoryStream())
                        {
                            bitmap.Save(ms, System.Drawing.Imaging.ImageFormat.Png);
                            ms.Position = 0;
                            string base64String = Convert.ToBase64String(ms.ToArray());
                            return Ok($"data:image/png;base64,{base64String}");
                        }
                    }
                }
            }
        }
    }
}
