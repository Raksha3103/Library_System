using Library_Management_System.Models;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class BorrowController : ControllerBase
{
    private readonly IBorrowService _borrowService;

    public BorrowController(IBorrowService borrowService)
    {
        _borrowService = borrowService;
    }

    [HttpPost]
    public async Task<IActionResult> BorrowBook([FromBody] BorrowCreateDTO dto)
    {
        try
        {
            var result = await _borrowService.BorrowBookAsync(dto);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("return")]
    public async Task<IActionResult> ReturnBook([FromBody] BorrowCreateDTO dto)
    {
        try
        {
            var result = await _borrowService.ReturnBookAsync(dto);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetBorrowRecords([FromQuery] int userId)
    {
        var result = await _borrowService.GetBorrowRecordsAsync(userId);
        return Ok(result);
    }

    [HttpGet("history")]
    public async Task<IActionResult> GetBorrowHistory()
    {
        var result = await _borrowService.GetBorrowHistoryAsync();
        return Ok(result);
    }
}
