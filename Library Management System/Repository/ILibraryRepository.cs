using System.Linq.Expressions;

namespace Library_Management_System.Repository
{
    public interface ILibraryRepository<T>
    {
        Task<List<T>> GetAllAsync();
        Task<T> GetByIdAsync(Expression<Func<T, bool>> filter, bool useNoTracking = false, params Expression<Func<T, object>>[] includes);
        Task<T> AddAsync(T dbRecord);
        Task<T> UpdateAsync(T dbRecord);
        Task<bool> DeleteAsync(T dbRecord);
    }
}
